window.fisiaSeedData = {
  metadata: {
    version: "2024.07",
    generatedAt: "2024-07-04T09:00:00Z"
  },
  professionals: [
    {
      id: "pro-ana",
      name: "Dra. Ana Torres",
      specialty: "Rehabilitación deportiva",
      color: "#4A9A8A",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80",
      cabin: "Cabina 1",
      workingDays: [1, 2, 3, 4, 5]
    },
    {
      id: "pro-elena",
      name: "Dra. Elena Gómez",
      specialty: "Neurología",
      color: "#5F86D3",
      avatar: "https://images.unsplash.com/photo-1544723128-7c40e5a71c5e?auto=format&fit=crop&w=160&q=80",
      cabin: "Cabina 2",
      workingDays: [1, 3, 5]
    },
    {
      id: "pro-marco",
      name: "Dr. Marco Reyes",
      specialty: "Traumatología",
      color: "#F5A623",
      avatar: "https://images.unsplash.com/photo-1544723795-43253796ca1c?auto=format&fit=crop&w=160&q=80",
      cabin: "Cabina 3",
      workingDays: [2, 4, 6]
    },
    {
      id: "pro-lucia",
      name: "Dra. Lucía Vera",
      specialty: "Pediatría",
      color: "#A855F7",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
      cabin: "Teleconsulta",
      workingDays: [1, 2, 3, 4, 5]
    }
  ],
  patients: [
    {
      id: "pat-laura",
      name: "Laura Fernández",
      avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80",
      birthday: "1989-03-11",
      phone: "+34 612 345 678",
      email: "laura.fernandez@example.com",
      status: "en_tratamiento",
      diagnosis: "Lumbalgia crónica",
      primaryTherapistId: "pro-ana",
      tags: ["Dolor lumbar", "Plan 8 sesiones"],
      adherence: 0.82,
      adherenceHistory: [
        { label: "Ene", value: 0.68 },
        { label: "Feb", value: 0.74 },
        { label: "Mar", value: 0.79 },
        { label: "Abr", value: 0.81 },
        { label: "May", value: 0.84 },
        { label: "Jun", value: 0.87 }
      ],
      plan: [
        {
          id: "plan-laura-1",
          title: "Recuperar movilidad lumbar",
          focus: "Fortalecimiento del core",
          status: "in_progress",
          sessionsTotal: 8,
          sessionsCompleted: 3,
          assignedTo: "pro-ana",
          nextSessionId: "ses-005"
        },
        {
          id: "plan-laura-education",
          title: "Educación postural",
          focus: "Hábitos en oficina",
          status: "pending",
          sessionsTotal: 4,
          sessionsCompleted: 0,
          assignedTo: "pro-elena"
        }
      ],
      soapNotes: [
        {
          id: "soap-201",
          date: "2024-06-28",
          authorId: "pro-miguel",
          title: "Sesión de seguimiento",
          painLevel: 4,
          subjective: "Dolor moderado 4/10 al levantarse, refiere rigidez matutina que cede tras estiramientos.",
          objective: "Flexión lumbar limitada al 70%, prueba de Schober +2cm, fuerza isométrica glúteo medio 4-/5.",
          assessment: "Se mantiene progreso; recomendar mantener protocolo de tracciones y reforzar estabilización.",
          plan: "Añadir bird-dog en cinta elástica, revisar ergonomía en puesto de trabajo, reevaluar en 7 días."
        },
        {
          id: "soap-168",
          date: "2024-06-14",
          authorId: "pro-ana",
          title: "Evaluación inicial",
          painLevel: 6,
          subjective: "Dolor lumbar irradiado a glúteo derecho tras jornadas largas.",
          objective: "SLR 60°, test de extensión positivo, trigger points en cuadrado lumbar.",
          assessment: "Hernia L4-L5 estable, iniciar trabajo de movilidad y control motor.",
          plan: "3 sesiones semanales durante 2 semanas, educación en pausas activas."
        }
      ],
      attachments: [
        {
          id: "att-resonancia-laura",
          name: "Resonancia lumbar.pdf",
          type: "pdf",
          uploadedAt: "2024-06-12T10:15:00Z",
          sizeKB: 760
        }
      ]
    },
    {
      id: "pat-carlos",
      name: "Carlos Rodríguez",
      avatar: "https://images.unsplash.com/photo-1544723795-43253796ca1c?auto=format&fit=crop&w=120&q=80",
      birthday: "1984-09-22",
      phone: "+34 699 128 945",
      email: "c.rodriguez@example.com",
      status: "alta",
      diagnosis: "Reconstrucción LCA rodilla derecha",
      primaryTherapistId: "pro-elena",
      tags: ["Deportista", "Post quirúrgico"],
      adherence: 0.94,
      adherenceHistory: [
        { label: "Ene", value: 0.90 },
        { label: "Feb", value: 0.92 },
        { label: "Mar", value: 0.93 },
        { label: "Abr", value: 0.95 },
        { label: "May", value: 0.94 },
        { label: "Jun", value: 0.94 }
      ],
      plan: [
        {
          id: "plan-carlos-1",
          title: "Protocolo retorno al running",
          focus: "Trabajo excéntrico y propiocepción",
          status: "completed",
          sessionsTotal: 10,
          sessionsCompleted: 10,
          assignedTo: "pro-elena"
        }
      ],
      soapNotes: [
        {
          id: "soap-301",
          date: "2024-05-18",
          authorId: "pro-elena",
          title: "Alta funcional",
          painLevel: 1,
          subjective: "Sin dolor en actividades de la vida diaria, inicio de trote suave.",
          objective: "Hop test simétrico, fuerza cuádriceps 5/5, balance Y test 98%.",
          assessment: "Listo para progresar a plan de readaptación deportiva.",
          plan: "Seguimiento mensual durante 3 meses, plan domiciliario mantenido."
        }
      ],
      attachments: []
    },
    {
      id: "pat-camila",
      name: "Camila Ortega",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
      birthday: "1995-01-15",
      phone: "+34 688 991 554",
      email: "camila.ortega@example.com",
      status: "en_tratamiento",
      diagnosis: "Tendinopatía de hombro",
      primaryTherapistId: "pro-marco",
      tags: ["Oficina", "Tendinopatía"],
      adherence: 0.58,
      adherenceHistory: [
        { label: "Ene", value: 0.65 },
        { label: "Feb", value: 0.61 },
        { label: "Mar", value: 0.54 },
        { label: "Abr", value: 0.55 },
        { label: "May", value: 0.57 },
        { label: "Jun", value: 0.58 }
      ],
      plan: [
        {
          id: "plan-camila-1",
          title: "Protocolo de manguito rotador",
          focus: "Fortalecimiento progresivo",
          status: "in_progress",
          sessionsTotal: 6,
          sessionsCompleted: 2,
          assignedTo: "pro-marco",
          nextSessionId: "ses-108"
        }
      ],
      soapNotes: [],
      attachments: []
    },
    {
      id: "pat-ines",
      name: "Inés Navarro",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
      birthday: "2006-05-07",
      phone: "+34 622 455 011",
      email: "ines.navarro@example.com",
      status: "en_tratamiento",
      diagnosis: "Escoliosis leve",
      primaryTherapistId: "pro-lucia",
      tags: ["Pediatría", "Escoliosis"],
      adherence: 0.91,
      adherenceHistory: [
        { label: "Ene", value: 0.88 },
        { label: "Feb", value: 0.90 },
        { label: "Mar", value: 0.92 },
        { label: "Abr", value: 0.93 },
        { label: "May", value: 0.92 },
        { label: "Jun", value: 0.91 }
      ],
      plan: [
        {
          id: "plan-ines-1",
          title: "Programa Schroth",
          focus: "Corrección postural",
          status: "in_progress",
          sessionsTotal: 12,
          sessionsCompleted: 6,
          assignedTo: "pro-lucia"
        }
      ],
      soapNotes: [],
      attachments: []
    }
  ],
  sessions: [
    {
      id: "ses-101",
      patientId: "pat-laura",
      professionalId: "pro-elena",
      start: "2024-07-04T09:00:00",
      end: "2024-07-04T09:45:00",
      status: "completed",
      type: "Seguimiento",
      cabin: "Cabina 2",
      channel: "presencial"
    },
    {
      id: "ses-102",
      patientId: "pat-camila",
      professionalId: "pro-ana",
      start: "2024-07-04T10:30:00",
      end: "2024-07-04T11:15:00",
      status: "confirmed",
      type: "Fortalecimiento",
      cabin: "Cabina 1",
      channel: "presencial"
    },
    {
      id: "ses-103",
      patientId: "pat-carlos",
      professionalId: "pro-marco",
      start: "2024-07-04T12:00:00",
      end: "2024-07-04T12:45:00",
      status: "cancelled",
      type: "Reevaluación",
      cabin: "Cabina 3",
      channel: "presencial",
      cancelReason: "Sobrecarga laboral"
    },
    {
      id: "ses-104",
      patientId: "pat-ines",
      professionalId: "pro-lucia",
      start: "2024-07-04T16:00:00",
      end: "2024-07-04T16:45:00",
      status: "available",
      type: "Teleconsulta",
      cabin: "Teleconsulta",
      channel: "online"
    },
    {
      id: "ses-105",
      patientId: "pat-laura",
      professionalId: "pro-ana",
      start: "2024-07-05T11:00:00",
      end: "2024-07-05T11:45:00",
      status: "pending",
      type: "Movilización",
      cabin: "Cabina 1",
      channel: "presencial"
    },
    {
      id: "ses-106",
      patientId: "pat-camila",
      professionalId: "pro-marco",
      start: "2024-07-05T09:30:00",
      end: "2024-07-05T10:15:00",
      status: "pending",
      type: "Electroterapia",
      cabin: "Cabina 3",
      channel: "presencial"
    }
  ],
  invoices: [
    {
      id: "INV-1043",
      patientId: "pat-laura",
      issueDate: "2024-06-15",
      dueDate: "2024-07-10",
      amount: 180,
      currency: "EUR",
      status: "pending",
      method: "Transferencia",
      createdBy: "pro-ana",
      concept: "Bono 5 sesiones",
      items: 5
    },
    {
      id: "INV-1038",
      patientId: "pat-carlos",
      issueDate: "2024-05-04",
      dueDate: "2024-05-18",
      paidAt: "2024-05-12",
      amount: 85,
      currency: "EUR",
      status: "paid",
      method: "TPV",
      createdBy: "pro-elena",
      concept: "Sesión seguimiento",
      items: 1
    },
    {
      id: "INV-1044",
      patientId: "pat-camila",
      issueDate: "2024-06-28",
      dueDate: "2024-07-12",
      amount: 120,
      currency: "EUR",
      status: "overdue",
      method: "Pendiente",
      createdBy: "pro-marco",
      concept: "Plan 6 sesiones",
      items: 6
    },
    {
      id: "INV-1045",
      patientId: "pat-ines",
      issueDate: "2024-06-30",
      dueDate: "2024-07-30",
      amount: 240,
      currency: "EUR",
      status: "pending",
      method: "Transferencia",
      createdBy: "pro-lucia",
      concept: "Programa Schroth",
      items: 12
    }
  ],
  reminders: [
    {
      id: "rem-501",
      patientId: "pat-camila",
      sessionId: "ses-106",
      channel: "WhatsApp",
      sendAt: "2024-07-04T11:00:00",
      status: "scheduled",
      message: "Hola Camila, recuerda tu sesión mañana a las 09:30 con el Dr. Marco. Responde 1 para confirmar."
    },
    {
      id: "rem-502",
      patientId: "pat-laura",
      sessionId: "ses-105",
      channel: "Email",
      sendAt: "2024-07-04T18:00:00",
      status: "sent",
      message: "Confirmación de cita: viernes 11:00 con la Dra. Ana"
    }
  ],
  tasks: [
    {
      id: "task-001",
      text: "Confirmar asistencia de Laura para mañana",
      relatedPatientId: "pat-laura",
      completed: false
    },
    {
      id: "task-002",
      text: "Enviar plan domiciliario actualizado a Camila",
      relatedPatientId: "pat-camila",
      completed: false
    },
    {
      id: "task-003",
      text: "Subir informe post alta de Carlos",
      relatedPatientId: "pat-carlos",
      completed: true
    },
    {
      id: "task-004",
      text: "Generar factura para programa Schroth (Inés)",
      relatedPatientId: "pat-ines",
      completed: false
    }
  ],
  analytics: {
    metrics: [
      {
        id: "completedSessions",
        label: "Sesiones Completadas",
        value: 124,
        trend: 0.052,
        trendLabel: "+5.2% vs. mes anterior",
        icon: "check_circle"
      },
      {
        id: "noShows",
        label: "Tasa de No-shows",
        value: 0.082,
        trend: -0.015,
        trendLabel: "-1.5% vs. mes anterior",
        icon: "event_busy"
      },
      {
        id: "revenue",
        label: "Ingresos Totales",
        value: 15670,
        trend: 0.121,
        trendLabel: "+12.1% vs. mes anterior",
        icon: "payments"
      },
      {
        id: "newPatients",
        label: "Pacientes Nuevos",
        value: 45,
        trend: 0.08,
        trendLabel: "+8.0% vs. mes anterior",
        icon: "group_add"
      }
    ],
    sessionTrends: [
      { label: "Sem 1", completed: 32, noshows: 3 },
      { label: "Sem 2", completed: 28, noshows: 2 },
      { label: "Sem 3", completed: 31, noshows: 1 },
      { label: "Sem 4", completed: 33, noshows: 0 }
    ],
    adherenceByMonth: [
      { label: "Ene", value: 0.78 },
      { label: "Feb", value: 0.81 },
      { label: "Mar", value: 0.84 },
      { label: "Abr", value: 0.82 },
      { label: "May", value: 0.86 },
      { label: "Jun", value: 0.89 }
    ],
    lowAdherencePatients: [
      { patientId: "pat-camila", therapistId: "pro-marco", planned: 6, missed: 2 },
      { patientId: "pat-laura", therapistId: "pro-ana", planned: 8, missed: 1 },
      { patientId: "pat-ines", therapistId: "pro-lucia", planned: 12, missed: 1 }
    ]
  }
};
